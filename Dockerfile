# Use the official Node.js image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./

RUN npm install

# Copy the entire project
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]