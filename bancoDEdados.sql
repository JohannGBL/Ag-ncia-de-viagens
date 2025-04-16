
use agencia_viagens;


CREATE TABLE viagens (
	id INT AUTO_INCREMENT PRIMARY KEY,
	destino VARCHAR(255) NOT NULL,
	data_viagem DATE NOT NULL,
	preco DECIMAL(10, 2) NOT NULL,
	vagas INT NOT NULL
);
select * FROM viagens;
