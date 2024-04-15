import { useState, useEffect } from 'react';
import RepresentativeStatusApi from '../api/RepresentativeStatusApi';
import { parsePhoneNumber } from '../utilities/phoneNumbers';

export function useRepresentativeStatus() {
  const [representative, setRepresentative] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepStatus = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await RepresentativeStatusApi.getRepresentativeStatus();
        if (response.data.id) {
          const { attributes } = response.data;
          const { contact, extension } = parsePhoneNumber(attributes.phone);

          // address as displayed on contact card + google maps link
          const concatAddress = [
            attributes.addressLine1,
            attributes.addressLine2,
            attributes.addressLine3,
            attributes.city,
            attributes.stateCode,
            attributes.zipCode,
          ]
            .filter(str => str)
            .join(' ');

          // rep contact card
          const vcfData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${attributes.name}`,
            `TEL:${contact}`,
            `EMAIL:${attributes.email}`,
            `ADR:;;${concatAddress}`,
            'END:VCARD',
          ].join('\n');

          const encodedVCard = `data:text/vcard;charset=utf-8,${encodeURIComponent(
            vcfData,
          )}`;

          setRepresentative({
            id: response.data.id,
            repType: response.data.type,
            ...attributes,
            concatAddress,
            contact,
            extension,
            vcard: encodedVCard,
          });
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepStatus();
  }, []);

  return { representative, isLoading, error };
}
