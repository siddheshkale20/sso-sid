FROM node:alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package*.json ./
COPY ./package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY ./views ./views
COPY ./src ./src
COPY ./.env ./ 

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node","src/index.js"]