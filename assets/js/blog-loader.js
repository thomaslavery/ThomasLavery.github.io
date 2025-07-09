// Blog loader utility for GitHub Pages
class BlogLoader {
    constructor() {
        this.blogFiles = [];
    }

    async loadBlogs() {
        // First discover all available blog files
        await this.discoverBlogFiles();
        
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
        
        // Sort blogs by filename in reverse order (newest first)
        blogs.sort((a, b) => {
            const aNum = parseInt(a.filename.replace('blog', '').replace('.txt', ''));
            const bNum = parseInt(b.filename.replace('blog', '').replace('.txt', ''));
            return bNum - aNum; // Reverse order: newest first
        });
        
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
        const baseUrl = 'kLOCClubBlogs/';
        const maxBlogs = 50; // Increased limit for more blogs
        
        this.blogFiles = []; // Reset the list
        
        for (let i = 1; i <= maxBlogs; i++) {
            const filename = `blog${i}.txt`;
            const filepath = baseUrl + filename;
            
            try {
                const response = await fetch(filepath);
                if (response.ok) {
                    this.blogFiles.push(filepath);
                } else if (response.status === 404) {
                    // If we get a 404, we've probably reached the end
                    break;
                }
            } catch (error) {
                // Stop trying if we get an error
                break;
            }
        }
        
        console.log(`Discovered ${this.blogFiles.length} blog files:`, this.blogFiles);
    }
} 