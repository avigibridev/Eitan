# Use official Node.js image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install required OS packages (optional but good for building native deps)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app in dev mode (auto-reloads with watch)
CMD ["npm", "run", "start:dev"]
