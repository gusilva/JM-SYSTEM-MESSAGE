package jm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class UserDAOImpl implements UserDAO {
    private static final Logger logger = LoggerFactory.getLogger(UserDAOImpl.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @SuppressWarnings("unchecked")
    public List<User> getAllUsers() {
        return entityManager.createNativeQuery("SELECT * FROM User").getResultList();
    }

    @Override
    public void createUser(User user) {
        entityManager.persist(user);
    }

    @Override
    public void deleteUser(User user) {
        User searchedUser = entityManager.find(User.class, user.getId());
        if (searchedUser != null) {
            entityManager.remove(searchedUser);
        }
    }

    @Override
    public void updateUser(User user) {
        entityManager.merge(user);
        entityManager.flush();
    }

    @Override
    public User getUserById(int id) {
        return entityManager.find(User.class, id);
    }

    @Override
    public User getUserByLogin(String login) {
        try {
            return (User) entityManager.createNativeQuery("select * from User where login='" + login + "'").getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
