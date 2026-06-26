package com.hospital.repositories;

import com.hospital.dtos.MedicoRankingDTO;
import com.hospital.models.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {

    @Query("SELECT new com.hospital.dtos.MedicoRankingDTO(m.id, m.nome, m.crm, m.especialidade, COUNT(c)) " +
           "FROM Consulta c JOIN c.medico m " +
           "GROUP BY m.id, m.nome, m.crm, m.especialidade " +
           "ORDER BY COUNT(c) DESC")
    List<MedicoRankingDTO> findMedicosComMaisConsultas();
}
