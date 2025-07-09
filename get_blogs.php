w<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$blogs = [];
$blogDir = 'kLOCClubBlogs/';

// Check if directory exists
if (!is_dir($blogDir)) {
    echo json_encode(['error' => 'Blog directory not found']);
    exit;
}

// Get all .txt files from the directory
$files = glob($blogDir . '*.txt');

foreach ($files as $file) {
    $content = file_get_contents($file);
    $lines = explode("\n", $content);
    
    // First line is the title
    $title = trim($lines[0]);
    
    // Remove the first line and any empty lines at the beginning
    array_shift($lines);
    while (!empty($lines) && trim($lines[0]) === '') {
        array_shift($lines);
    }
    
    // The rest is the content
    $content = implode("\n", $lines);
    
    $blogs[] = [
        'title' => $title,
        'content' => $content,
        'filename' => basename($file)
    ];
}

// Sort blogs by filename to maintain consistent order
usort($blogs, function($a, $b) {
    return strcmp($a['filename'], $b['filename']);
});

echo json_encode($blogs);
?> 