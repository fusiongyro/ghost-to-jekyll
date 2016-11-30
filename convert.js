#!/usr/bin/env node

const yaml   = require('js-yaml');
const fs     = require('fs');
const moment = require('moment');

function convert(filename) {
    console.log("converting " + filename);

    // first, let's make a directory here for _posts
    try {
        fs.mkdirSync("_posts");
    }
    catch (e) {
        // ignore the error, because the folder probably exists
    }

    // parse the JS export from Ghost
    let exp = JSON.parse(fs.readFileSync(filename));

    // now let's iterate the blog posts
    exp.db[0].data.posts.forEach(convertPost);
}

function convertPost(post) {
    // there are two parts to a post: some front-matter and some content
    // they are separated by -- and the content goes in a file named
    // 'post-slug.markdown' in _posts
    let date = moment(post.created_at);
    let filename = `_posts/${date.format('YYYY-MM-DD')}-${post.slug}.md`;

    console.log("  creating " + filename);

    let out = fs.createWriteStream(filename);
    out.write('---\n');
    let markdown = post.markdown;
    delete post.markdown;
    delete post.html;
    let frontmatter = {
        title: post.title,
        layout: 'post',
        permalink: post.slug,
        published: post.status === 'published',
    };
    out.write(yaml.dump(frontmatter));
    out.write('---\n');
    out.write(markdown, () => out.close());
}

// run the command line arguments through the converter
process.argv.slice(2).forEach(convert);
