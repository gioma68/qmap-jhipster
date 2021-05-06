package it.expleo.qmap.importer.webinspect;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("it.expleo.qmap.importer.webinspect");

        noClasses()
            .that()
            .resideInAnyPackage("it.expleo.qmap.importer.webinspect.service..")
            .or()
            .resideInAnyPackage("it.expleo.qmap.importer.webinspect.repository..")
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage("..it.expleo.qmap.importer.webinspect.web..")
            .because("Services and repositories should not depend on web layer")
            .check(importedClasses);
    }
}
