@echo off
echo ===================================================
echo        Starting SentinelOps AI (Local Dev)
echo ===================================================
echo.

echo [1/5] Installing NPM Dependencies...
call npm install
echo.

echo [2/5] Starting PostgreSQL and Redis in Docker...
call docker-compose up -d postgres redis
echo.

echo Waiting 5 seconds for the database to be fully ready...
timeout /t 5 /nobreak > NUL
echo.

echo [3/5] Setting up Database (Prisma Generate ^& Migrate)...
call npm --workspace @sentinelops/api run prisma:generate
call npm --workspace @sentinelops/api run prisma:migrate -- --name init
echo.

echo [4/5] Seeding Database with Default Data...
call npm --workspace @sentinelops/api run seed
echo.

echo [5/5] Starting API and Frontend Dev Servers...
echo ---------------------------------------------------
echo Frontend will be available at: http://localhost:3000
echo API will be available at:      http://localhost:4000
echo ---------------------------------------------------
call npm run dev

pause
