FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install and verify
RUN npm install && \
    npm list

# Copy source code
COPY . .

# Show contents for debugging
RUN ls -la && \
    ls -la src/

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]
