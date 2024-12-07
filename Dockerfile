FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy src directory
COPY src/ ./src/

# Make sure port 8080 is available
EXPOSE 8080

# Set the environment variable
ENV PORT=8080

# Start the application (now referencing src/server.js)
CMD ["node", "src/server.js"]
