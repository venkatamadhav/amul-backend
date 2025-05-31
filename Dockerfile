FROM node:20-slim

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Build the TypeScript files
RUN npm run build

# Clean up dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 8000

# Start the application
CMD ["node", "dist/server.js"] 