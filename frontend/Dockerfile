# Multi-stage dockerfile for frontend/
# Stage 1: Build (if needed in future)
# Stage 2: Production: Serve with Nginx

# Use official Nginx Alpine image (lightweight)
FROM nginx:alpine

# Metadata
LABEL maintainer="CozyReads Team"
LABEL description="Frontend container for CozyReads bookstore"
LABEL version="1.0.0"

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy all frontend files to Nginx html directory
COPY public/ /usr/share/nginx/html/

# Create necessary directories and set permissions
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start Nginx (foreground mode for Docker)
CMD ["nginx", "-g", "daemon off;"]
