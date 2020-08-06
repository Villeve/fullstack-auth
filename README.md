# fullstack-auth
Project base with JWT authentication

Node.js / Vue.js / Express.js / Postgres / Keycloak / Nginx

## Requirements
- Docker
- Docker-compose
- Open ports
  - 80
  - 3000
  - 5432
  - 8000
  - 8080
## How to run
1. In the project root enter command:
```
docker-compose up
```
2. Navigate to 
```
http://localhost/auth
```
3. Log in with user credentials - admin / password

4. Create new realm called "keycloak-demo"

5. Create new client with ID "vue-test-app" and OIDC protocol

6. Enter client settings and enter "http://localhost/*" to Valid Redirect URIs and "*" to Web Origins. Leave other settings default

7. Create new user in the "Users" tab

8. Navigate to "http://localhost" and login to the user account you just created

You are now logged in! Currently there is not much to do in the application. You can log out, fetch your own user information or a secret message. Anyhow, the secret message is only available for admin users. You can fetch it, once you have created role called "admin" in the keycloak administrator console (Roles tab) and added it to your user ("Roles mapping" page in the "Users" tab)
