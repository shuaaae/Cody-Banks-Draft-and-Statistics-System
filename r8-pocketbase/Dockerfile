FROM alpine:latest

# Install required packages
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget

# Create app directory
WORKDIR /app

# Download PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.21.3/pocketbase_0.21.3_linux_amd64.zip \
    && unzip pocketbase_0.21.3_linux_amd64.zip \
    && chmod +x pocketbase \
    && rm pocketbase_0.21.3_linux_amd64.zip

# Create pb_data directory
RUN mkdir -p pb_data

# Expose port
EXPOSE 8080

# Start PocketBase
CMD ["./pocketbase", "serve", "--http=0.0.0.0:8080"] 