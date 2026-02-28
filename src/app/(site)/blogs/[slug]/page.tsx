import Image from "next/image";
import React from "react";
import PopularPost from "@/components/ui/PopularPost";

const SingleBlogPage = async ({ params }: { params: { slug: string } }) => {
    // Next 15 compatibility
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams.slug;

    const res = await fetch(`http://localhost:3059/api/blog-posts/slug/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        return <div className="text-center py-40">Failed to load blog post.</div>;
    }

    const { data: blogPost } = await res.json();

    if (!blogPost) {
        return <div className="text-center py-40">Blog post not found.</div>;
    }

    return (
        <>
            <div className="blog-wrap font-dm">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 lg:pb-24 pb-20 justify-center">
                    <div className="blog-title bg-light-blue-banner lg:pt-20 pt-14 font-dm">
                        {/* Post Title */}
                        <div className="lg:w-8/12 text-center pb-12 mx-auto lg:pt-20 pt-14">
                            <div className="flex justify-center mb-3">
                                <div className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-semibold uppercase text-gray-900 bg-white shadow-sm flex items-center gap-2 w-auto" data-aos="zoom-in" data-aos-delay="0" data-aos-duration="400">
                                    Blog
                                </div>
                            </div>
                            <h2 className="text-3xl md:text-5xl text-gray-900 font-semibold mb-1 md:mb-2" data-aos="fade-up" data-aos-duration="400" data-aos-delay="0">
                                {blogPost.title}
                            </h2>
                            <p className="text-gray-800 font-medium text-base mb-0" data-aos="fade-up" data-aos-duration="400" data-aos-delay="100">
                                {blogPost.date} &bull; {blogPost.readTime}
                            </p>
                            <p className="mt-4 text-gray-600 font-semibold">{blogPost.excerpt}</p>
                        </div>
                    </div>

                    {/* Post Image */}
                    <div className="lg:w-11/12 justify-center pb-14 mx-auto" data-aos="fade-up" data-aos-duration="400" data-delay="0">
                        <Image src={blogPost.image || "/images/blog-single.svg"} alt={blogPost.title} width={1200} height={600} className="object-cover w-full rounded-xl" />
                    </div>

                    {/* Post Content */}
                    <div className="lg:w-8/12 prose dark:prose-invert mx-auto" dangerouslySetInnerHTML={{ __html: blogPost.content }}>
                    </div>

                    {/* Author Bottom */}
                    <div className="lg:w-8/12 mx-auto mt-10 p-6 border rounded-lg flex items-center gap-4">
                        <Image src={blogPost.authorAvatar || "/images/avatars/user.png"} alt={blogPost.author} width={80} height={80} className="rounded-full" />
                        <div>
                            <h4 className="text-xl font-bold">{blogPost.author}</h4>
                            <p className="text-gray-600">{blogPost.authorPosition}</p>
                        </div>
                    </div>
                </div>
            </div>
            <PopularPost />
        </>
    );
};

export default SingleBlogPage;
