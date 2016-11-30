var yaml = require('js-yaml');
var blog = JSON.parse(fs.readFileSync('daniels-blog.ghost.2016-11-29.json'));
blog.db[0].data.posts.forEach(post => yaml.safeWrite(post));