const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const app = require('./app');

chai.use(chaiHttp);

//joining path of directory
let allFiles = [];
const directoryPath = path.join(__dirname, '/media');

let fileNames = fs.readdirSync(directoryPath, (err, files) => {
    if (err) return console.log('Unable to scan directory: ' + err);
    return files
});

for (let i = 0; i < fileNames.length; i++) {
    const content = fs.readFileSync(`${directoryPath}\\${fileNames[i]}`);
    allFiles.push(content);
}

describe('Reader Test', () => {
    it('should return the id3 tag', (done) => {
        chai.request(app)
          .post('/')
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .attach('audio', allFiles[0], fileNames[0])
          .attach('audio', allFiles[1], fileNames[1])
          .attach('audio', allFiles[2], fileNames[2])
          /*.attach('audio', allFiles[3], fileNames[3])
          .attach('audio', allFiles[4], fileNames[4])
          .attach('audio', allFiles[5], fileNames[5])
          .attach('audio', allFiles[6], fileNames[6])*/
          .end((err, res) => {
            expect(res.status).to.be.eql(200);
            expect(res.type).to.be.equal('application/json');
            expect(res.body).to.be.an('object');
            //expect(res.body.data.length).to.be.eql(6);
            //expect(res.body.data[0].originalname).to.eql('Travis_Greene-Soul_Will_Sing.mp3');
            //expect(res.body.data[0].id3Tag.Title).to.eql('Soul Will Sing');
            done();
          });
      });
});
