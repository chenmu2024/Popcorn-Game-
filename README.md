# Popcorn Games Website

A modern, premium collection of popcorn-themed games designed for the US and European markets. Users can browse and play various types of popcorn games through an embedded iframe system.

## Features

- Modern responsive design optimized for all devices
- Premium UI interface with popcorn-themed elements
- Iframe game embedding without additional plugins
- Game categorization system for easy navigation
- User comments and rating system
- Search functionality to quickly find games
- Mobile-friendly interface design

## Tech Stack

- HTML5
- CSS3 (Flexbox and Grid layout)
- JavaScript (ES6+)
- Responsive design
- Font Awesome icons
- Google Fonts (Poppins)

## File Structure

```
/
├── index.html                  # Homepage
├── css/
│   └── style.css               # Main CSS file
├── js/
│   └── main.js                 # Main JavaScript file
├── images/                     # Image resources
│   ├── logo.png
│   ├── popcorn-pattern.png
│   ├── popcorn-pattern-light.png
│   ├── popcorn-pattern-dark.png
│   ├── popcorn-bottom.png
│   ├── popcorn-icon.png
│   ├── games/                  # Game thumbnails
│   └── avatars/                # User avatars
├── games/                      # Game pages
│   ├── game1.html
│   ├── game2.html
│   └── ...
└── categories/                 # Category pages
    ├── action.html
    ├── puzzle.html
    └── ...
```

## Deployment Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/popcorn-games.git
   cd popcorn-games
   ```

2. Deploy to your web server, or test locally using:

   Using Python's simple server:
   ```
   python -m http.server
   ```
   Then visit [Popcorn Game](https://popcorngame.pro/) in your browser

   Or using Node.js http-server:
   ```
   npx http-server
   ```
   Then visit [Popcorn Game](https://popcorngame.pro/) in your browser

3. Adding games:
   - Create new HTML files in the `games/` directory
   - Use iframes to embed your game URLs
   - Add game cards to the homepage and relevant category pages
   - Add game thumbnails to the `images/games/` directory

## Customization

### Adding New Games

1. Create a new HTML file in the `games/` directory (copy from an existing game page and modify content)
2. Update the iframe src attribute to your game URL
3. Modify game title, description, and other details
4. Add a new game card to the homepage grid

### Modifying Styles

- Primary colors and style variables are defined in the CSS `:root` selector for easy global color scheme modifications
- All component styles have clear comments for easy location and modification
- Popcorn-themed backgrounds and patterns can be adjusted or replaced

## Design Elements

- Orange and purple color scheme inspired by popcorn and premium gaming experiences
- Popcorn-themed background patterns and decorative elements
- Smooth animations and transitions for a polished feel
- Card-based design for game presentation
- Floating animations on category icons

## License

This project is licensed under the MIT License 
