# DevPulse

**DevPulse** is an internal tech issue and feature tracker built for software teams. It allows team members to report bugs, suggest feature requests, view reported issues, and coordinate issue resolution with role-based permissions.

Live URL: [https://devpulse-sakimuzzaman.vercel.app/](https://devpulse-sakimuzzaman.vercel.app/)

---

## Features

### Authentication
- User registration with name, email, password, and role
- User login with JWT-based authentication
- Password hashing using bcrypt
- Protected routes using JWT verification
- Role-based access control for contributor and maintainer users

### Issue Management
- Create new bug reports or feature requests
- View all issues publicly
- View single issue details publicly
- Filter issues by type and status
- Sort issues by newest or oldest
- Update issues with role-based permission rules
- Delete issues as a maintainer

### Role Permissions

#### Contributor
- Can register and log in
- Can create issues
- Can view all issues
- Can update only their own issue
- Can update an issue only while its status is `open`
- Cannot change issue workflow status
- Cannot delete issues

#### Maintainer
- Can do everything a contributor can
- Can update any issue
- Can change issue workflow status
- Can delete any issue

---

## Tech Stack

| Technology | Purpose |
|----------|---------|
| Node.js | Runtime environment |
| TypeScript | Type-safe JavaScript |
| Express.js | Backend API framework |
| PostgreSQL | Relational database |
| Neon | Hosted PostgreSQL database |
| pg | Native PostgreSQL driver |
| Raw SQL | Direct database queries using `pool.query()` |
| bcrypt | Password hashing |
| jsonwebtoken | JWT generation and verification |
| http-status-codes | Consistent HTTP status code usage |
| dotenv | Environment variable management |

---

## Project Structure

```bash
devpulse/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── index.ts
│   ├── db/
│   │   ├── index.ts
│   │   └── schema.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.types.ts
│   │   └── issues/
│   │       ├── issues.controller.ts
│   │       ├── issues.routes.ts
│   │       ├── issues.service.ts
│   │       ├── issues.validation.ts
│   │       └── issues.types.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── asyncHandler.ts
│   │   ├── jwt.ts
│   │   └── response.ts
│   └── types/
│       └── express.d.ts
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md