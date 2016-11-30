const yaml   = require('js-yaml');
const fs     = require('fs');
const moment = require('moment');

function convert(filename) {
    // first, let's make a directory here for _posts
    try {
        fs.mkdirSync("_posts");
    }
    catch (e) {
        // ignore the error, because the folder probably exists
    }

    // parse the JS export from Ghost
    var exp = JSON.parse(fs.readFileSync(filename));

    // now let's iterate the blog posts
    exp.db[0].data.posts.forEach(convertPost);
}

function convertPost(post) {
    // there are two parts to a post: some front-matter and some content
    // they are separated by -- and the content goes in a file named
    // 'post-slug.markdown' in _posts
    var date = moment(post.created_at);
    var out = fs.createWriteStream(`_posts/${date.format('YYYY-MM-DD')}-${post.slug}.md`);
    out.write('---\n', () => {
        var markdown = post.markdown;
        delete post.markdown;
        delete post.html;
        post.layout = 'post';
        post.permalink = post.slug;
        post.published = post.status === 'published';
        out.write(yaml.dump(post), () => {
            out.write('---\n', () => {
                out.write(markdown, () => {
                    out.close();
                })
            })
        })
    });
}

// run the command line arguments through the converter
process.argv.slice(2).forEach((val) => convert(val));
