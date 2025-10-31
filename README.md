Por seguridad, este repositorio no incluye certificados, llaves privadas ni archivos con credenciales. Los mismos se excluyen mediante el .gitignore.

Dentro de la carpeta crypto/ se guardan los certificados (.pem, .crt, .key, etc.) que identifican a la organización y a los usuarios en la red Hyperledger Fabric.
Estos archivos permiten firmar transacciones y autenticar la comunicación entre nodos, por lo que no deben compartirse ni subirse a ningún repositorio público.

También se excluyen:
    - .env y variantes: contienen credenciales y rutas de conexión.

    - wallet/: guarda identidades de usuario registradas en la red.

    - connection-org1.json: perfil de conexión con los nodos de la red.


Cada entorno debe generar sus propios certificados y credenciales.
