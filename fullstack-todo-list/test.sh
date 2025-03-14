#!/bin/bash


check_service() {
    local service_name=$1
    local service_url=$2

    echo "Checking $service_name at $service_url..."
    
    if curl --fail --silent --head "$service_url"; then
        echo " $service_name is UP!"
    else
        echo "$service_name is DOWN!"
    fi
    echo "------------------------------------"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo " Docker is not running. start Docker and try again."
    exit 1
fi

echo "Running container health checks..."


if docker ps | grep -q "backend"; then
    echo " Backend container is running."
else
    echo " Backend container is NOT running."
fi


if docker ps | grep -q "mongo"; then
    echo " MongoDB container is running."
else
    echo " MongoDB container is NOT running."
fi


if docker ps | grep -q "frontend"; then
    echo "Frontend container is running."
else
    echo "Frontend container is NOT running."
fi


check_service "Backend API" "http://localhost:4000/api/todos"


echo "Checking MongoDB connection..."
docker exec -it $(docker ps -qf "name=mongo") mongosh --eval "db.runCommand({ping: 1})"


if docker ps | grep -q "frontend"; then
    check_service "Frontend App" "http://localhost:80"
fi

echo "All checks complete!"
