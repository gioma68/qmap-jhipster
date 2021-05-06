package it.expleo.qmap.importer.sonarqb;

import it.expleo.qmap.importer.sonarqb.QMapSonarQbImporterApp;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = QMapSonarQbImporterApp.class)
public @interface IntegrationTest {
}
