// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Gridsome Blog Starter',
  siteDescription: 'A simple, hackable & minimalistic starter for Gridsome that uses Markdown for content.',

  templates: {
    Post: '/:title',
    Tag: '/tag/:id'
  },

  plugins: [
    // {
    //   // Create posts from markdown files
    //   use: '@gridsome/source-filesystem',
    //   options: {
    //     typeName: 'Post',
    //     path: 'content/posts/*.md',
    //     refs: {
    //       // Creates a GraphQL collection from 'tags' in front-matter and adds a reference.
    //       tags: {
    //         typeName: 'Tag',
    //         create: true
    //       }
    //     }
    //   }
    // },
    // {
    //   use: '@gridsome/source-graphql',
    //   options: {
    //     url: 'https://api.supersheets.io/staging/1HVYGsrqm9rpBaeZE7y7OIt4atpA2S38gkynN51_vLnw/graphql',
    //     fieldName: 'supersheet',
    //     typeName: 'Supersheet',
    //     headers: {
    //       // Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    //     },
    //   },
    // },
  ],

  transformers: {
    //Add markdown support to all file-system sources
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
      plugins: [
        '@gridsome/remark-prismjs'
      ]
    }
  }
}
