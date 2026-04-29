FROM nginx:alpine

# Copy the widget files to the nginx public directory
# We copy them into a subdirectory 'widget' to match the expected pathing in documentation
COPY . /usr/share/nginx/html/widget/

# Create a simple index.html for health checks and basic testing
RUN echo "Firon Chat Widget Static Server is running" > /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
