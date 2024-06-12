/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const fs = require('fs');
const { spawn } = require('child_process');
const chokidar = require('chokidar');
const log = require('./logger/log.js');

const currentDirectory = __dirname;
const subdirectoryPath = `${currentDirectory}`;

function startProject() {
    const child = spawn('node', ['Goat.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    child.on('close', (code) => {
        if (code == 2) {
            log.info('Restarting Project...');
            startProject();
        }
    });
}

function executeGitCommand(command, cwd) {
    const child = spawn(command, [], {
        shell: true,
        cwd: cwd,
        stdio: 'inherit'
    });
}

function commitAndPushChanges(filePath) {
    const delayInSeconds = 2;

    executeGitCommand('git add .', subdirectoryPath);
    console.log('Changes added');

    setTimeout(() => {
        executeGitCommand(`git commit -m 'Updated ${filePath}'`, subdirectoryPath);
        console.log('Changes committed');

        setTimeout(() => {
            executeGitCommand('git push', subdirectoryPath);
            console.log('Pushed successfully');
        }, delayInSeconds * 1000 );
    }, delayInSeconds * 1000);
}
const ignoredDirectories = [
  /node_modules/,
  /dist/,
  /build/,
  /^\./
];
const watcher = chokidar.watch(subdirectoryPath, {
  ignored: ignoredDirectories,
  persistent: true,
  usePolling: true, // Use polling to work around ENOSPC issue
});

watcher.on('all', (event, filePath) => {
  console.log(`Event: ${event} for ${filePath}`);
  if (event === 'add' || event === 'change') {
    commitAndPushChanges(filePath);
  } else if (event === 'unlink') {
    deleteFileFromGit(filePath);
  }
});

function deleteFileFromGit(filePath) {
    executeGitCommand(`git rm ${filePath}`, subdirectoryPath);
    executeGitCommand(`git commit -m 'Deleted ${filePath}'`, subdirectoryPath);
    executeGitCommand('git push', subdirectoryPath);
    console.log(`Deleted ${filePath} from Git repository`);
}

try {
    startProject(); // Comment this line if not needed.
} catch (error) {
    console.error(egrror);
}
