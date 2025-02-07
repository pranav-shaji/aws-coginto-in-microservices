

Books Library Microservices Project
This project is a microservices-based book library application designed for scalable and secure operations. Each service is independently deployed and manages a distinct set of responsibilities with dedicated databases and APIs.

Key Features
Microservices Architecture: Organized into separate services for books, customers, orders, and more, each with individual database connections and ports.
Secure Authentication:
AWS Cognito Integration: Enables secure, scalable, and faster user authentication.
Argon2 Password Hashing: Provides an additional layer of security on regular sign-in and sign-up routes.
Environment-Specific Configurations: Each service maintains its environment variables for optimized, isolated configuration.
