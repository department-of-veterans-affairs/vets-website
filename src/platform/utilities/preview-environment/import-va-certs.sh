#!/bin/sh

(
    cd /usr/local/share/ca-certificates/

    curl -LO https://cacerts.digicert.com/DigiCertTLSRSASHA2562020CA1-1.crt.pem

    wget \
        --level=1 \
        --quiet \
        --recursive \
        --no-parent \
        --no-host-directories \
        --no-directories \
        --accept="VA*.cer" \
        http://aia.pki.va.gov/PKI/AIA/VA/
    
    for cert in *.cer *.pem
    do
        # the aim is to check what the input file/namestring we are processing
        echo "[[ PROCESSING:${cert} ]]"
        if file ${cert} | grep 'PEM'
        then
            cp "${cert}" "${cert}.crt"
            # the aim is to check what the input file/namestring we are processing
            echo "[[ COPY: ${cert}.crt (from ${cert})]]"
        else
            openssl x509 -in "${cert}" -inform der -outform pem -out "${cert}.crt"
            # the aim is to check what the input file/namestring we are processing
            echo "[[ CREATE: ${cert}.crt (from ${cert})]]"
         fi
        # the aim is to check what the input file/namestring we are processing
        echo "[[ DELETION: ${cert}, which is hopefully the original)]]"
        rm "${cert}"
    done

    update-ca-certificates --fresh

    # Display VA Internal certificates that are now trusted
    awk -v cmd='openssl x509 -noout -subject' '/BEGIN/{close(cmd)};{print | cmd}' < /etc/ssl/certs/ca-certificates.crt \
    | grep -iE '(VA-Internal|DigiCert)'
)