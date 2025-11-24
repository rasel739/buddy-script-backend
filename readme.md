# Buddy Script Backend API

A production-ready, scalable backend for a buddy script application built with Node.js, Express, TypeScript, Prisma, and PostgreSQL. Designed to handle millions of users with optimal performance and security.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Post Management**: Create, read, update, delete posts with image support
- **Image Upload**: Cloudinary integration with automatic optimization and CDN delivery
- **Infinite Scroll**: Cursor-based pagination for smooth, endless feed scrolling
- **Privacy Controls**: Public and private post visibility
- **Engagement System**: Like/unlike posts, comments, and replies
- **Nested Comments**: Comment on posts and reply to comments
- **Social Features**: View who liked posts, comments, or replies
- **Image Optimization**: Automatic resizing, compression, and format conversion
- **Type Safety**: Full TypeScript implementation
- **Input Validation**: Zod schema validation for all inputs
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Security**: CORS, rate limiting ready, SQL injection prevention

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **HTTP Status**: http-status
- **Image Upload**: Cloudinary
- **Image Processing**: Sharp
- **File Upload**: Multer

## 🏗️ Architecture & Design Decisions

### Database Design

The database schema is optimized for scalability:

1. **Indexes**: Strategic indexes on frequently queried columns:

   - `email` for fast user lookups
   - `createdAt DESC` for efficient feed sorting
   - Composite indexes on foreign keys with timestamps
   - Unique constraints on like tables to prevent duplicates

2. **Cascade Deletes**: Proper foreign key relationships with cascade deletes to maintain data integrity

3. **Normalization**: Properly normalized schema to reduce data redundancy

4. **Scalability Considerations**:
   - CUID for distributed ID generation
   - Separate like tables for efficient like/unlike operations
   - Text fields for content to support long posts

### API Design

- **RESTful principles**: Clear, predictable endpoints
- **Versioning**: `/api/v1` prefix for future compatibility
- **Consistent responses**: Standardized JSON response format
- **Error handling**: Proper HTTP status codes and error messages

### Security Features

1. **Password Security**:

   - Bcrypt with 12 salt rounds
   - Passwords never returned in responses

2. **JWT Authentication**:

   - Stateless authentication
   - Token expiration (7 days default)
   - Secure token verification

3. **Input Validation**:

   - Zod schemas for all inputs
   - SQL injection prevention via Prisma
   - XSS protection through input sanitization

4. **Access Control**:
   - Private posts only visible to authors
   - Users can only edit/delete their own content
   - Post authors can delete comments on their posts

### Performance Optimizations

1. **Efficient Queries**:

   - Select only needed fields
   - Use Prisma's `include` and `select` strategically
   - Pagination to limit data transfer

2. **Database Optimization**:

   - Proper indexing strategy
   - Composite unique constraints for like tables
   - Optimized for read-heavy workloads

3. **Scalability**:
   - Stateless authentication for horizontal scaling
   - Connection pooling ready
   - Caching strategy ready (Redis can be added)

## 📦 Installation

### Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/rasel739/buddy-script-backend.git
cd buddy-script-backend
```

2. **Install dependencies**

```bash
yarn install
```

3. **Environment Setup**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/social_feed_db?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:5000,http://localhost:5173"
```

4. **Database Setup**

```bash
# Generate Prisma Client
yarn prisma:generate

# Run migrations
yarn prisma:migrate

# Or push schema directly (for development)
yarn prisma:push
```

5. **Start Development Server**

```bash
yarn dev
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                | Description       | Auth Required |
| ------ | ----------------------- | ----------------- | ------------- |
| POST   | `/api/v1/auth/register` | Register new user | No            |
| POST   | `/api/v1/auth/login`    | Login user        | No            |
| GET    | `/api/v1/auth/user`     | Get current user  | Yes           |

### Posts

| Method | Endpoint                  | Description          | Auth Required |
| ------ | ------------------------- | -------------------- | ------------- |
| POST   | `/api/v1/posts`           | Create post          | Yes           |
| GET    | `/api/v1/posts/feed`      | Get feed (paginated) | Yes           |
| GET    | `/api/v1/posts/:id`       | Get single post      | Yes           |
| PATCH  | `/api/v1/posts/:id`       | Update post          | Yes           |
| DELETE | `/api/v1/posts/:id`       | Delete post          | Yes           |
| POST   | `/api/v1/posts/:id/like`  | Toggle like on post  | Yes           |
| GET    | `/api/v1/posts/:id/likes` | Get post likes       | Yes           |

### Comments

| Method | Endpoint                        | Description            | Auth Required |
| ------ | ------------------------------- | ---------------------- | ------------- |
| POST   | `/api/v1/comments`              | Create comment         | Yes           |
| GET    | `/api/v1/comments/post/:postId` | Get comments for post  | Yes           |
| PATCH  | `/api/v1/comments/:id`          | Update comment         | Yes           |
| DELETE | `/api/v1/comments/:id`          | Delete comment         | Yes           |
| POST   | `/api/v1/comments/:id/like`     | Toggle like on comment | Yes           |
| GET    | `/api/v1/comments/:id/likes`    | Get comment likes      | Yes           |

### Replies

| Method | Endpoint                             | Description             | Auth Required |
| ------ | ------------------------------------ | ----------------------- | ------------- |
| POST   | `/api/v1/replies`                    | Create reply            | Yes           |
| GET    | `/api/v1/replies/comment/:commentId` | Get replies for comment | Yes           |
| PATCH  | `/api/v1/replies/:id`                | Update reply            | Yes           |
| DELETE | `/api/v1/replies/:id`                | Delete reply            | Yes           |
| POST   | `/api/v1/replies/:id/like`           | Toggle like on reply    | Yes           |
| GET    | `/api/v1/replies/:id/likes`          | Get reply likes         | Yes           |

## 📝 API Examples

### Register User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Create Post

```bash
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: multipart/form-data

# With image
 POST http://localhost:5000/api/v1/post/
   "Authorization: Bearer <token>" \
   "content=This is my first post!" \
   "isPrivate=false" \
   "image=@/path/to/image.jpg"

# Without image (JSON)
{
  "content": "This is my first post!",
  "isPrivate": false
}
```

### Get Feed

```bash
GET /api/v1/posts/feed?limit=20
Authorization: Bearer <token>

# For infinite scroll, use cursor from previous response
GET /api/v1/posts/feed?cursor=2024-01-15T10:30:00.000Z&limit=20
Authorization: Bearer <token>
```

Response:

```json
{
  "success": true,
  "data": {
    "posts": [...],
    "nextCursor": "2024-01-15T10:30:00.000Z",
    "hasMore": true
  }
}
```

### Create Comment

```bash
POST /api/v1/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great post!",
  "postId": "cm4abc123..."
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The token is returned upon successful registration or login.

## 📊 Database Schema

### User

- id (CUID, Primary Key)
- email (Unique)
- password (Hashed)
- fullName
- createdAt
- updatedAt

### Post

- id (CUID, Primary Key)
- content (Text)
- imageUrl (Optional)
- isPrivate (Boolean)
- authorId (Foreign Key → User)
- createdAt (Indexed DESC)
- updatedAt

### PostLike

- id (CUID, Primary Key)
- postId (Foreign Key → Post)
- userId (Foreign Key → User)
- createdAt
- Unique constraint: (postId, userId)

### Comment

- id (CUID, Primary Key)
- content (Text)
- postId (Foreign Key → Post)
- authorId (Foreign Key → User)
- createdAt
- updatedAt

### CommentLike

- id (CUID, Primary Key)
- commentId (Foreign Key → Comment)
- userId (Foreign Key → User)
- createdAt
- Unique constraint: (commentId, userId)

### Reply

- id (CUID, Primary Key)
- content (Text)
- commentId (Foreign Key → Comment)
- authorId (Foreign Key → User)
- createdAt
- updatedAt

### ReplyLike

- id (CUID, Primary Key)
- replyId (Foreign Key → Reply)
- userId (Foreign Key → User)
- createdAt
- Unique constraint: (replyId, userId)

## 🚀 Production Deployment

### Environment Variables for Production

```env
NODE_ENV="production"
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="<strong-random-secret>"
JWT_EXPIRES_IN="7d"
PORT=5000
ALLOWED_ORIGINS="https://yourfrontend.com"

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Build for Production

```bash
yarn build
yarn start
```

### Deployment Platforms

- **Render**: Managed PostgreSQL and web services

### Database Migrations

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## 📈 Scalability Considerations

### For Millions of Users

1. **Database**:

   - Use PostgreSQL connection pooling (PgBouncer)
   - Implement read replicas for read-heavy operations
   - Consider database sharding for extreme scale
   - Use Redis for caching frequently accessed data

2. **Application**:

   - Horizontal scaling with load balancers
   - Implement CDN for image serving
   - Use message queues for async operations (notifications)
   - Implement rate limiting per user

3. **Monitoring**:
   - Application performance monitoring (APM)
   - Database query performance monitoring
   - Error tracking (Sentry)
   - Logging aggregation (ELK Stack)

## 🔒 Security Best Practices

- Keep dependencies updated
- Use environment variables for sensitive data
- Implement rate limiting (express-rate-limit)
- Use HTTPS in production
- Implement request validation
- Add helmet.js for security headers
- Regular security audits

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Rasel Hossain

## 🐛 Known Issues / Future Enhancements

- [ ] Implement rate limiting
- [ ] Add Redis caching layer
- [ ] Implement real-time notifications (WebSockets)
- [ ] Add image upload functionality (multer + S3)
- [ ] Implement search functionality
- [ ] Add user profiles and follow system
- [ ] Implement hashtags and mentions
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add unit and integration tests
- [ ] Implement API documentation (Swagger)

## 📞 Support

email: raselhossain6059@gmail.com or open an issue in the repository.
