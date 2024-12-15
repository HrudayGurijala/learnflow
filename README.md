# Learnflow

## About the Project

This Node.js web application using EJS template engine which features OAuth 2.0 authentication for secure Google sign-ins. It includes role-based access control for "Creator" and "Student" roles, enabling Creators to upload and post videos while Students can view them. The app supports infinite threaded comments and utilizes AWS S3 and CDN for efficient media storage and delivery, employing Pre-Signed URLs for direct uploads.

## Features

- **OAuth 2.0 Authentication**: Secure sign-in with Google accounts.
- **Role-Based Access Control**: Distinguishes between "Creator" and "Student" roles.
  - Creators can upload and post learning videos.
  - Students can view posted videos.
- **Threaded Comments**: Hierarchical data structure for infinite threaded comments on videos.
- **AWS Integration**: 
  - S3 bucket and CDN for efficient media storage and delivery.
  - Pre-Signed URLs for direct uploads to S3, enhancing performance.

## Tech Stack

- **Backend**: Node.js, Express.js,EJS
- **Database**: MongoDB
- **Authentication**: OAuth 2.0 (Google)
- **Cloud Services**: AWS S3, AWS CloudFront (CDN)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/HrudayGurijala/learnflow.git
   cd Learnify
   ```

2. **Install dependencies:**
   ```bash
   cd Learnify
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file in the `Learnify` directory and add your variables (example below):
     ```env
      MONGO_URI=your_mongo_db_uri
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret
      AWS_REGION=your_aws_region
      AWS_ACCESS_KEY_ID=your_aws_access_key_id
      AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
      CLOUDFRONT_DDN=your_cloudfront_distribution_domain_name
     ```

4. **Run the application:**
   ```bash
   cd Learnify
   npm start
   ```

## Usage

1. **Sign in with Google** to access the application.
2. **Creators** can upload and post learning videos.
3. **Students** can view the posted videos.
4. **Comment** on videos with threaded replies for organized discussions.


## Contact

For any questions or feedback, feel free to reach out at preethamjayam2004@gmail.com.