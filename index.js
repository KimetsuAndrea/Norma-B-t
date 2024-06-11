const fs = require('fs');
const path = require('path');
const NodeGit = require('nodegit');

const repoDir = 'https://github.com/KimetsuAndrea/Norman_1bot';
const watchDir = `${__dirname}`;

const credentials = NodeGit.Cred.userpassPlaintextNew(
    '@KimetsuAndrea',
    'Iloveyoute5'
);

function commitAndPush() {
    NodeGit.Repository.open(repoDir)
        .then(repo => {
            return repo.refreshIndex();
        })
        .then(index => {
            return index.addAll('./*')
                .then(() => index.write())
                .then(() => index.writeTree());
        })
        .then(oid => {
            return NodeGit.Reference.nameToId(repo, 'HEAD')
                .then(head => repo.getCommit(head))
                .then(parent => {
                    const author = NodeGit.Signature.now('Your Name', 'your.email@example.com');
                    return repo.createCommit('HEAD', author, author, 'Automatic commit', oid, [parent]);
                });
        })
        .then(() => {
            console.log('Changes committed successfully.');
            return NodeGit.Remote.lookup(repo, 'origin');
        })
        .then(remote => {
            return remote.push(
                ['refs/heads/master:refs/heads/master'],
                {
                    callbacks: {
                        credentials: function(url, userName) {
                            return credentials;
                        }
                    }
                }
            );
        })
        .then(() => {
            console.log('Changes pushed successfully.');
        })
        .catch(err => {
            console.error('Error:', err);
        });
}

fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
    console.log(`${filename} has been ${eventType}`);
    if (eventType === 'change') {
        commitAndPush();
    }
});

console.log(`Watching directory ${watchDir} for changes...`);
