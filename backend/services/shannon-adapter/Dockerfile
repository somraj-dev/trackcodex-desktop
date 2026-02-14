FROM node:20-alpine

WORKDIR /app

# Copy Shannon adapter package.json
COPY backend/services/shannon-adapter/package.json ./

# Install only Shannon dependencies (fastify)
RUN npm install --production

# Copy Shannon adapter source
COPY backend/services/shannon-adapter/server.ts ./src/server.ts

# Install typescript for build, compile, then remove devDeps
RUN npm install typescript@5 @types/node@20 --save-dev && \
    npx tsc --outDir dist --esModuleInterop --module commonjs --target es2020 --moduleResolution node --skipLibCheck src/server.ts && \
    npm prune --production && \
    rm -rf src

# Expose port
EXPOSE 4100

ENV SHANNON_PORT=4100
ENV SHANNON_HOST=0.0.0.0

CMD ["node", "dist/server.js"]
