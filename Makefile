up:
	docker compose up -d

install:
	npm install

db:
	npm --workspace @sentinelops/api run prisma:generate
	npm --workspace @sentinelops/api run prisma:migrate -- --name init
	npm --workspace @sentinelops/api run seed

dev:
	npm run dev

test:
	npm run test
