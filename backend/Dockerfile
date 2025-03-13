# Sử dụng image Node.js từ Docker Hub
FROM node:18-alpine

# Đặt thư mục làm việc trong container
# Đạt thư mục làm việc giúp cho tệp không lộn xộn.
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt dependencies
# 1. Tải xuống và cài đặt các dependencies được liệt kê trong package.json 
# 2. Tạo thư mục node_modules trong container
# 3. Giúp container chạy độc lập với máy host
RUN npm install

# Sao chép mã nguồn vào container
COPY . .

# Chạy ứng dụng trên cổng 8081
EXPOSE 8081

# Lệnh chạy ứng dụng khi container khởi động
CMD ["node", "src/server.js"]
