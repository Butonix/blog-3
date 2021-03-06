import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { listBlogWithCatAndTags } from '../../helpers/blogFetch';

import Card from '../../components/Blog/Card';
import Search from '../../components/Search';

const Blogs = ({
  blogs,
  categories,
  tags,
  blogLimit,
  blogSkip,
  totalBlogs,
  statusCode
}) => {
  const [limit, setLimit] = useState(blogLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadBlogs, setLoadBlogs] = useState([]);

  if (statusCode === 404) {
    return (
      <div className="text-center">
        <h1>Oops</h1>
        <p>There is no blog</p>
      </div>
    );
  }
  //   console.log('limit', limit);
  //   console.log('skip', skip);
  //   console.log('size', size);
  //   console.log(loadBlogs);

  const loadMore = async () => {
    let toSkip = skip + limit;
    const data = await listBlogWithCatAndTags(toSkip, limit);
    setLoadBlogs([...loadBlogs, ...data.blogs]);
    setSize(data.size);
    setSkip(toSkip);
  };

  const loadMoreButton = () =>
    size > 0 &&
    size >= limit && (
      <button onClick={() => loadMore()} className="btn btn-primary btn-lg">
        Load more
      </button>
    );

  const showLoadBlogs = () =>
    loadBlogs.map(blog => (
      <article key={blog._id}>
        <Card blog={blog} />
        <hr />
      </article>
    ));

  const showAllBlogs = () =>
    blogs.map(blog => (
      <article key={blog._id}>
        <Card blog={blog} />
        <hr />
      </article>
    ));

  const showAllCategories = () =>
    categories.map(el => (
      <Link href={`/categories/${el.slug}`} key={el._id}>
        <a className="btn btn-outline-info m-1">{el.name}</a>
      </Link>
    ));

  const showAllTags = () =>
    tags.map(el => (
      <Link href={`/tags/${el.slug}`} key={el._id}>
        <a className="btn btn-outline-primary m-1">{el.name}</a>
      </Link>
    ));

  return (
    <>
      <Layout>
        <Search />
        <main>
          <div className="container">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="title">Programming Blog and Tutorials</h1>
              </div>
              <section>
                <div className="pb-3 text-center">
                  <div>{showAllCategories()} </div>
                  <div>{showAllTags()}</div>
                </div>
              </section>
            </header>
          </div>
          <div className="container">{showAllBlogs()}</div>
          <div className="container">{showLoadBlogs()}</div>
          <div className="container pt-2 pb-5 text-center">
            {loadMoreButton()}
          </div>
        </main>
      </Layout>
    </>
  );
};

//https://nextjs.org/learn/basics/fetching-data-for-pages
//Render props before the component mounts
Blogs.getInitialProps = async function() {
  let skip = 0;
  let limit = 2;
  const data = await listBlogWithCatAndTags(skip, limit);
  if (!data) {
    return { statusCode: 404 };
  } else {
    return {
      blogs: data.blogs,
      categories: data.categories,
      tags: data.tags,
      totalBlogs: data.size,
      blogLimit: limit,
      blogSkip: skip
    };
  }
};

export default Blogs;
