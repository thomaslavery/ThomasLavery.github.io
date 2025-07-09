// Blog loader utility
class BlogLoader {
    constructor() {
        this.blogFiles = [
            'kLOCClubBlogs/blog1.txt',
            'kLOCClubBlogs/blog2.txt',
            'kLOCClubBlogs/blog3.txt',
            'kLOCClubBlogs/blog4.txt'
        ];
    }

    async loadBlogs() {
        const blogs = [];
        
        for (const file of this.blogFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const content = await response.text();
                    const blog = this.parseBlogContent(content, file);
                    if (blog) {
                        blogs.push(blog);
                    }
                }
            } catch (error) {
                console.warn(`Could not load ${file}:`, error);
            }
        }
        
        return blogs;
    }

    parseBlogContent(content, filename) {
        const lines = content.split('\n');
        
        // First line is the title
        const title = lines[0].trim();
        
        // Remove the first line and any empty lines at the beginning
        lines.shift();
        while (lines.length > 0 && lines[0].trim() === '') {
            lines.shift();
        }
        
        // The rest is the content
        const blogContent = lines.join('\n');
        
        return {
            title: title,
            content: blogContent,
            filename: filename.split('/').pop()
        };
    }

    // Method to automatically discover new blog files
    async discoverBlogFiles() {
        // This is a simple approach - in a real implementation, you might want
        // to maintain a list or use a different approach
        const baseUrl = 'kLOCClubBlogs/';
        const maxBlogs = 20; // Reasonable limit
        
        for (let i = 1; i <= maxBlogs; i++) {
            const filename = `blog${i}.txt`;
            const filepath = baseUrl + filename;
            
            try {
                const response = await fetch(filepath);
                if (response.ok) {
                    if (!this.blogFiles.includes(filepath)) {
                        this.blogFiles.push(filepath);
                    }
                } else {
                    // If we can't find a blog file, we've probably reached the end
                    break;
                }
            } catch (error) {
                // Stop trying if we get an error
                break;
            }
        }
    }
} 