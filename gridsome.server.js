// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const SUPERSHEETS_GRAPHQL_URI = 'https://api.supersheets.io/staging/1HVYGsrqm9rpBaeZE7y7OIt4atpA2S38gkynN51_vLnw/graphql'
const { ApolloClient } = require('apollo-boost')
const gql = require('graphql-tag')
const { InMemoryCache } = require('apollo-cache-inmemory')
const fetch = require('node-fetch')
const { createHttpLink, HttpLink } = require('apollo-link-http')
const remark = require('remark')
const html = require('remark-html')

const cache = new InMemoryCache();
const link = createHttpLink({ uri: SUPERSHEETS_GRAPHQL_URI, fetch: fetch })
const client = new ApolloClient({
  cache,
  link
})

const siteQuery = gql`
  query {
    findOneSite {
      id
      title
      description
    }
  }`

const authorQuery = gql`
  query {
    findOneAuthor {
      id
      name
      email
      avatar
      intro
    }
  }`

const tagQuery = gql`
  query {
    findTags {
      rows {
        row {
          id
          title
          path
        }
      }
    }
  }`

const postQuery = gql`
  query {
    findPosts(filter: { published: { eq: true } }) {
      rows {
        row {
          id
          path
          title
          read_time
          date
          published
          tags
          content {
            description
            body
          }
        }
      }
    }
  }`

module.exports = function (api) {
  api.loadSource(async ({ addCollection }) => {
    // Use the Data store API here: https://gridsome.org/docs/data-store-api/
    let siteData = await client.query({ query: siteQuery })
    console.log(JSON.stringify(siteData, null, 2))
    let siteCollection = addCollection('Site')
    let site = siteData.data.findOneSite
    siteCollection.addNode({
      id: site.id,
      title: site.title,
      description: site.description
    })

    let authorData = await client.query({ query: authorQuery })
    console.log(JSON.stringify(authorData, null, 2))
    let authorCollection = addCollection('Author')
    let author = authorData.data.findOneAuthor
    authorCollection.addNode({
      id: author.email,
      name: author.name,
      email: author.email,
      avatar: author.avatar,
      intro: author.intro
    })

    let tagData = await client.query({ query: tagQuery })
    let tagCollection = addCollection('Tag')
    //console.log("tagDATA", JSON.stringify(tagData, null, 2))
    for (const row of tagData.data.findTags.rows) {
      let node = {
        id: row.row.id,
        title: row.row.title,
        path: row.row.path
      }
      console.log("Tag", node)
      tagCollection.addNode(node)
    }

    let postData = await client.query({ query: postQuery })
    let postCollection = addCollection('Post')
    postCollection.addReference('tags', 'Tag')
    //console.log("postsDATA", JSON.stringify(postData, null, 2))
    for (const row of postData.data.findPosts.rows) {
      let node = {
        id: row.row.path,
        path: row.row.path,
        title: row.row.title,
        read_time: row.row.read_time,
        date: row.row.date,
        published: row.row.published,
        tags: row.row.tags,
        content: {
          description: row.row.content && row.row.content.description || null,
          body: row.row.content && row.row.content.body || null
        }
      }
      node.content.body = (await remark().use(html).process(node.content.body)).toString()
      postCollection.addNode(node)
    }
  })
}
