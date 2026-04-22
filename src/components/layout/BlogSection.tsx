'use client';

import { useEffect, useState } from 'react';
import BlogCardThree from '@/components/ui/BlogCardThree';
import PageTitle3 from '@/components/ui/PageTitle3';
import Button from '@/components/ui/Button';

interface BlogItem {
    id: string;
    slug: string;
    image: string;
    title: string;
    date: string;
    readTime: string;
    excerpt: string;
    content: string;
    author: string;
    authorAvatar: string;
    authorPosition: string;
    createdAt: string;
    updatedAt: string;
}

interface SectionData {
    tag_line?: string;
    parent_title?: string;
    parent_subtitle?: string;
    [key: string]: unknown;
}

export default function BlogSection() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [sectionData, setSectionData] = useState<SectionData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Fetch section data
                const sectionRes = await fetch('/api/backend/feature-sections?section_name=blogs');
                if (sectionRes.ok) {
                    const sData = await sectionRes.json();
                    setSectionData(sData);
                }

                const response = await fetch('/api/backend/blog-posts');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBlogs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <section className="blog-wrap lg:py-20 py-16">
                <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 text-center">
                    <div className="text-gray-600">Loading blog entries...</div>
                </div>
            </section>
        );
    }

    // Limit to 3 posts for the home page display
    const displayBlogs = blogs.slice(0, 3);

    return (
        <section className="blog-wrap lg:py-20 py-16">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-6 md:px-14 lg:px-14 xl:px-18 2xl:px-3 pb-0 lg:py-4 py-0">
                <div className="flex flex-wrap justify-between pb-16 gap-y-4">
                    <PageTitle3
                        badgeText={sectionData?.tag_line || ""}
                        title={sectionData?.parent_title || "Stay informed with our latest blog entries"}
                        subtitle={sectionData?.parent_subtitle || "New blog articles, insights, and updates here."}
                        widthClass="w-full xl:w-5/12 lg:w-7/12"
                        alignment="start"
                        padding="pb-0"
                    />
                    <div className="lg:text-right mt-auto">
                        <Button href="/blogs" label="Check out for more blog" bgColor="bg-blue-900" textColor="text-white" />
                    </div>
                </div>
                <div className="grid lg:grid-cols-3 gap-6 md:grid-cols-2 sm:grid-cols-1">
                    {displayBlogs.map((post) => (
                        <BlogCardThree
                            key={post.id}
                            post={{
                                slug: `blogs/${post.slug}`,
                                image: post.image,
                                title: post.title,
                                date: post.date,
                                readTime: `${post.readTime} min read`,
                                excerpt: post.excerpt,
                                author: post.author,
                                authorAvatar: post.authorAvatar,
                                authorPosition: post.authorPosition
                            }}
                        />
                    ))}
                </div>
                {blogs.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 italic">No blog posts found.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
