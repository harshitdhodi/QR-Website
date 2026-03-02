import Image from "next/image";
import React from "react";
import PopularPost from "@/components/ui/PopularPost";

const SingleBlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
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
                   {/* Post Content */}
<div className="lg:w-8/12 mx-auto">
    <style>{`
        .blog-content {
            // font-family: 'Georgia', 'Times New Roman', serif;
            color: #1a1a2e;
        }

        /* Drop cap on first paragraph */
        .blog-content > p:first-of-type::first-letter {
            float: left;
            font-size: 4.5rem;
            line-height: 0.85;
            margin: 0.05em 0.12em 0 0;
            font-weight: 700;
            color: #111827;
            // font-family: 'Georgia', serif;
        }

        .blog-content p {
            font-size: 1.125rem;
            line-height: 1.9;
            color: #374151;
            margin-bottom: 1.6rem;
            letter-spacing: 0.01em;
        }

        @media (min-width: 768px) {
            .blog-content p {
                font-size: 1.1875rem;
                line-height: 2;
            }
        }

        .blog-content h2 {
            // font-family: var(--font-dm, 'DM Sans', sans-serif);
            font-size: 1.6rem;
            font-weight: 700;
            color: #111827;
            margin-top: 3rem;
            margin-bottom: 0.85rem;
            letter-spacing: -0.02em;
            line-height: 1.25;
        }

        .blog-content h3 {
            // font-family: var(--font-dm, 'DM Sans', sans-serif);
            font-size: 1.25rem;
            font-weight: 650;
            color: #1f2937;
            margin-top: 2.25rem;
            margin-bottom: 0.6rem;
            letter-spacing: -0.015em;
            line-height: 1.3;
        }

        @media (min-width: 1024px) {
            .blog-content h2 { font-size: 1.875rem; }
            .blog-content h3 { font-size: 1.4rem; }
        }

        .blog-content ul,
        .blog-content ol {
            font-size: 1.0625rem;
            line-height: 1.85;
            color: #374151;
            padding-left: 1.75rem;
            margin-bottom: 1.6rem;
        }

        .blog-content ul { list-style-type: disc; }
        .blog-content ol { list-style-type: decimal; }

        .blog-content li {
            margin-bottom: 0.55rem;
            padding-left: 0.25rem;
        }

        .blog-content strong, .blog-content b {
            font-weight: 700;
            color: #111827;
        }

        .blog-content em, .blog-content i {
            font-style: italic;
            color: #4b5563;
        }

        .blog-content a {
            color: #2563eb;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-decoration-thickness: 1px;
            transition: color 0.15s ease;
        }
        .blog-content a:hover { color: #1d4ed8; }

        /* Pull quote / blockquote */
        .blog-content blockquote {
            border-left: 3px solid #111827;
            padding: 0.75rem 1.5rem;
            margin: 2.5rem 0;
            background: transparent;
            font-style: italic;
            font-size: 1.25rem;
            line-height: 1.75;
            color: #1f2937;
        }

        .blog-content blockquote p {
            font-size: inherit;
            margin: 0;
            color: inherit;
        }

        /* Inline code */
        .blog-content code {
            background: #f3f4f6;
            border-radius: 4px;
            padding: 0.15em 0.4em;
            font-size: 0.88em;
            color: #1f2937;
            // font-family: 'Menlo', 'Monaco', monospace;
        }

        /* Horizontal rule as ornamental divider */
        .blog-content hr {
            border: none;
            text-align: center;
            margin: 2.5rem 0;
            color: #9ca3af;
            letter-spacing: 0.5em;
        }
        .blog-content hr::before {
            content: '· · ·';
        }

        /* Responsive table */
        .blog-content .table-responsive {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin-bottom: 1.5rem;
        }
        .blog-content table {
            width: 100%;
            min-width: 400px;
            border-collapse: collapse;
            font-size: 0.9375rem;
            // font-family: var(--font-dm, 'DM Sans', sans-serif);
        }
        .blog-content th, .blog-content td {
            border: 1px solid #e5e7eb;
            padding: 0.625rem 1rem;
            text-align: left;
        }
        .blog-content th {
            background: #f9fafb;
            font-weight: 600;
            color: #111827;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        .blog-content tr:nth-child(even) td { background: #fafafa; }

        /* Images */
        .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.625rem;
            margin: 1.5rem 0;
        }

        /* Caption-style small text after images */
        .blog-content img + em {
            display: block;
            text-align: center;
            font-size: 0.8125rem;
            color: #9ca3af;
            margin-top: -0.75rem;
            margin-bottom: 1.5rem;
        }
    `}</style>
    <div
        className="blog-content"
        dangerouslySetInnerHTML={{
            __html: blogPost.content
                .replace(/<table/g, '<div class="table-responsive"><table')
                .replace(/<\/table>/g, '</table></div>')
        }}
    />
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
