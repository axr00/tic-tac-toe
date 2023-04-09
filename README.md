# Tic Tac Toe 

Docker config based on https://github.com/dunglas/symfony-docker

## Getting Started

1. If not already done, [install Docker Compose](https://docs.docker.com/compose/install/)
2. Run `docker-compose build --pull --no-cache` to build fresh images
3. Run `docker-compose up` (the logs will be displayed in the current shell)
4. Open `https://localhost` in your favorite web browser and [accept the auto-generated TLS certificate](https://stackoverflow.com/a/15076602/1352334)


## Using

- Up in background: `docker-compose up -d`
- Create DB: `docker-compose exec php bin/console doctri:data:create`
- Cache clear:`docker-compose exec php bin/console cache:clear`
- Using console `docker-compose exec php bin/console`
- Access DB: `docker-compose exec db mysql -proot`
- Link DB from Host: 127.0.0.1:13306  root / root
- Show logs: `docker-compose logs php`
- Access PHP container `docker-compose exec php ash`
- Run `docker-compose down --remove-orphans` to stop the Docker containers.
