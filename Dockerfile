FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
# Install Maven 3.9.16 from Maven Central (mantém todas as versões permanentemente)
ARG MAVEN_VERSION=3.9.16
RUN apt-get update -q && apt-get install -y -q wget && \
    wget -q "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/${MAVEN_VERSION}/apache-maven-${MAVEN_VERSION}-bin.tar.gz" && \
    tar -xzf "apache-maven-${MAVEN_VERSION}-bin.tar.gz" -C /opt && \
    ln -s "/opt/apache-maven-${MAVEN_VERSION}/bin/mvn" /usr/local/bin/mvn && \
    rm "apache-maven-${MAVEN_VERSION}-bin.tar.gz" && \
    apt-get remove -y wget && rm -rf /var/lib/apt/lists/*
COPY pom.xml ./
RUN mvn dependency:go-offline -q
COPY src ./src
RUN mvn package -DskipTests -q

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/target/hospital-1.0.0.jar app.jar
EXPOSE 8090
ENTRYPOINT ["java", "-jar", "app.jar"]
