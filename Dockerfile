# Use official Node.js image
FROM node:lts

# Set working directory
WORKDIR /

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . ./

# Expose port
EXPOSE 8080

RUN npm run build

# Command to run the application
CMD ["npm", "run", "start"]
