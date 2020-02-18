const path = require('path');

const string = __filename;

console.log('path.sep', path.sep);
console.log('path.delimiter:', path.delimiter);
console.log('-------------------------------');
console.log('path.dirname():', path.dirname(string));
console.log('path.extname():', path.extname(string)); // 확장자
console.log('path.basename():', path.basename(string));
console.log('path.basename():', path.basename(string, path.extname(string))); // 확장자명 뺴고
console.log('-------------------------------');
console.log('path.parse():', path.parse(string));
console.log('path.format():', path.format({
    dir: 'C\\users\\zerocho',
    name: 'path',
    ext: '.js'
}));
console.log('path.normalize():', path.normalize('C://users\\\\zerocho\\\path.js'));
console.log('-------------------------------');
console.log('path.isAbsolute():', path.isAbsolute('C:\\')); // 절대경로인가 상대경로인가?
console.log('path.isAbsolite():', path.isAbsolute('./home'));
console.log('-------------------------------');
console.log('path.relative():', path.relative('C:\\users\\zerocho\\path.js', 'C:\\')); // 첫번째에서 두번쨰로 가는 길
console.log('path.join:', path.join(__dirname, '..', '..', '/users', '.', '/zerocho'));
console.log('path.resolve:', path.resolve(__dirname, '..', '..', '/users', '.', '/zerocho'));