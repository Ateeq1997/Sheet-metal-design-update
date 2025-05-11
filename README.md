Sheet Metal Designer with 3D Preview
This web application allows users to draw simple 2D sheet metal shapes (rectangle, circle, pentagon), add fold lines, and view a 3D preview using Three.js. Users can also download their designs as PNG or SVG and save/load designs from local storage.

📦 Deployment
https://sheet-metal-design-update.vercel.app/

📁 Project Structure
plaintext
Copy
Edit
├── index.html       # Main HTML page
├── style.css        # CSS for layout and styling (not provided here)
└── script.js        # Main JavaScript logic for drawing and 3D rendering

 Features
Draw basic 2D shapes (Rectangle, Circle, Pentagon)

Customize shape dimensions (Width and Height in mm)

Add fold lines (Vertical or Horizontal) to simulate bends

Live 3D preview using Three.js

Export your design:

📤 Download as PNG

📤 Download as SVG

🧷 Save and load your design to/from Local Storage

🛠️ Technologies Used
HTML5 for markup

CSS3 for basic styling

JavaScript for interaction and logic

Canvas API for 2D drawing

Three.js for 3D visualization

OrbitControls.js for interactive camera control

⚙️ How to Use
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/sheet-metal-designer.git
cd sheet-metal-designer
Open index.html in your browser
Simply open the file directly or use a local development server.

Draw a Shape

Select the shape type (rectangle, circle, pentagon)

Enter width and height (in mm)

Click Draw Shape

Add Fold Lines

Enter position (in mm) and direction (vertical/horizontal)

Click Add Fold

Preview in 3D

The 3D version updates automatically after drawing

Save / Load Design

Save to Local Storage to preserve your work

Load from Local Storage to continue editing

Export your Design

Download the drawing as a PNG or SVG

Upload index.html, script.js, and style.css to your server

🐞 Known Issues
No server-side saving; all save/load is local

Not optimized for mobile devices

No undo/redo functionality yet

📄 License
This project is open-source and available under the MIT License.

👨‍💻 Author
Ateeq ur Rehman

Github Repo link: https://github.com/Ateeq1997/Sheet-metal-design-update

Feel free to fork and contribute!

📷 Screenshots
![Screenshot 2025-05-11 221842](https://github.com/user-attachments/assets/8449b1b0-5023-4d8d-a9d8-3e177c9e9fee)
![Screenshot 2025-05-11 221818](https://github.com/user-attachments/assets/ab2018da-b622-4584-a239-1ff20a38a277)
![Screenshot 2025-05-11 221738](https://github.com/user-attachments/assets/6006f301-a48c-4a52-864f-a1c44ae5772a)
![Screenshot 2025-05-11 221857](https://github.com/user-attachments/assets/f53333b7-5c0a-4c1b-83fe-c3b4cc1c59b9)
