#!/bin/bash

# Mongo URI
NEW_URI='mongodb+srv://stream:Stream123@streamingapp.1jjw3rq.mongodb.net/streamingapp?retryWrites=true&w=majority'

# List of env files
FILES=(
  ".env"
  "backend/authService/.env"
  "backend/streamingService/.env"
  "backend/adminService/.env"
  "backend/chatService/.env"
)

echo "Updating .env files..."

# Update all .env files
for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    sed -i "/^MONGO_URI=/d" "$f"
    echo "MONGO_URI=$NEW_URI" >> "$f"
    echo "Updated: $f"
  else
    echo "File not found: $f"
  fi
done

echo ""
echo "Updating Helm values.yaml..."

# Update values.yaml safely
sed -i '/^mongoUri:/d' streamingapp-chart/values.yaml
echo "mongoUri: \"$NEW_URI\"" >> streamingapp-chart/values.yaml

echo ""
echo "Verification:"
echo "--------------------------------"

grep "MONGO_URI" backend/authService/.env
grep "mongoUri" streamingapp-chart/values.yaml

echo ""
echo "Done."
