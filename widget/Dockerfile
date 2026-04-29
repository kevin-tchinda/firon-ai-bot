FROM nginx:alpine

# Copy the widget files to the nginx public directory
COPY . /usr/share/nginx/html/widget/

# Create a simple index.html for health checks
RUN echo "Firon Chat Widget Static Server is running" > /usr/share/nginx/html/index.html

# We'll use a shell script to replace the port at runtime
CMD sed -i 's/listen\s*80;/listen '"$PORT"';/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
