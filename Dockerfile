FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Make sure port 8080 is available
EXPOSE 8080

# Set the environment variable
ENV PORT=8080

# Start the application
CMD ["node", "server.js"]
