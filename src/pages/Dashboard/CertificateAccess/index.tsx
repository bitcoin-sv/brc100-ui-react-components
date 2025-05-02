import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  IconButton,
  Avatar,
  Box,
  CircularProgress,
  Link as MuiLink // Renamed to avoid conflict with React Router Link if used
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DEFAULT_APP_ICON } from '../../../constants/popularApps';
import PageHeader from '../../../components/PageHeader'; // Assuming this component exists and is TSX
// import ProtocolPermissionList from '../../../components/ProtocolPermissionList'; // Needs migration/creation
// import CertificateAccessList from '../../../components/CertificateAccessList'; // Needs migration/creation
import { WalletContext } from '../../../WalletContext';
import { Img } from '@bsv/uhrp-react'; // Use uhrp-react from new dependencies

// Placeholder type for certificate definition - adjust based on actual SDK response
interface CertificateDefinition {
  name: string;
  iconURL?: string;
  description: string;
  documentationURL?: string;
  fields: Record<string, FieldDefinition>; // Assuming fields is an object
  // Add other relevant properties from CertMap resolveCertificateByType
}

interface FieldDefinition {
  fieldIcon?: string;
  friendlyName: string;
  description: string;
  // Add other relevant properties
}

/**
 * Displays details about a specific certificate type and lists issued certificates.
 */
const CertificateAccess: React.FC = () => {
  const history = useHistory();
  const { certType: encodedCertType } = useParams<{ certType: string }>();
  const certType = decodeURIComponent(encodedCertType);

  const { managers, settings } = useContext(WalletContext);

  const [copied, setCopied] = useState<{ [key: string]: boolean }>({ id: false });
  const [certDefinition, setCertDefinition] = useState<CertificateDefinition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertDefinition = async () => {
      // TODO: Replace CertMap logic with WalletContext/SDK equivalent
      // Need to determine how certificate definitions are resolved in the new architecture.
      // It might involve managers.lookupManager or a specific certificate manager.
      if (!managers.walletManager) return; // Or relevant manager

      setLoading(true);
      setError(null);
      try {
        console.warn('Certificate definition fetching logic needs implementation using WalletContext/SDK.');
        // Placeholder logic:
        const placeholderDef: CertificateDefinition = {
          name: `Certificate: ${certType}`,
          iconURL: DEFAULT_APP_ICON,
          description: 'Placeholder description for this certificate type. Fetching logic needs implementation.',
          documentationURL: 'https://docs.example.com/certificates',
          fields: {
            field1: {
              friendlyName: 'Example Field 1',
              description: 'Description for example field 1.',
              fieldIcon: ''
            }
          }
        };
        setCertDefinition(placeholderDef);

      } catch (err: any) {
        console.error('Failed to fetch certificate definition:', err);
        setError(`Failed to load certificate definition: ${err.message}`);
        toast.error(`Failed to load certificate definition: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCertDefinition();
  }, [certType, managers.walletManager]); // TODO: Re-evaluate dependency on trusted entities

  const handleCopy = (data: string, type: string) => {
    navigator.clipboard.writeText(data);
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  }

  if (!certDefinition) {
    return <Typography sx={{ p: 2 }}>Certificate definition not found for type: {certType}</Typography>;
  }

  const { name, iconURL, description, documentationURL, fields } = certDefinition;

  return (
    <Grid container spacing={3} direction='column' sx={{ p: 2 }}>
      <Grid item>
        <PageHeader
          history={history}
          title={name}
          subheading={
            <Box>
              <Typography variant='caption' color='textSecondary' sx={{ display: 'flex', alignItems: 'center' }}>
                Certificate Type: <Typography variant='caption' fontWeight='bold' sx={{ ml: 0.5 }}>{certType}</Typography>
                <IconButton size='small' onClick={() => handleCopy(certType, 'id')} disabled={copied.id} sx={{ ml: 0.5 }}>
                  {copied.id ? <CheckIcon fontSize='small' /> : <ContentCopyIcon fontSize='small' />}
                </IconButton>
              </Typography>
            </Box>
          }
          icon={iconURL || DEFAULT_APP_ICON} // Use iconURL or default
          showButton={false}
          buttonTitle="" // Added dummy prop
          onClick={() => {}} // Added dummy prop
        />
      </Grid>
      <Grid item>
        <Typography variant="body1">{description}</Typography>
        {documentationURL && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            <b>Documentation: </b>
            <MuiLink href={documentationURL} target='_blank' rel='noreferrer'>
              {documentationURL}
            </MuiLink>
          </Typography>
        )}
        <Typography sx={{ pt: '1em' }} variant='h4'>Fields</Typography>
        <Box component="ul" sx={{ pl: 2, listStyle: 'none' }}> {/* Use Box for list styling */} 
          {Object.entries(fields).map(([key, value], index) => {
            return (
              <Box component="li" key={index} sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                {value.fieldIcon && (
                  <Avatar sx={{ mr: 2, bgcolor: 'grey.200' }}> {/* Added bgcolor for placeholder */} 
                    <Img
                      style={{ width: '75%', height: '75%' }}
                      src={value.fieldIcon}
                      // uhrpUrl={"TODO: Add UHRP URL if needed"} // Add UHRP URL if required by Img component
                    />
                  </Avatar>
                )}
                <Box>
                  <Typography variant='subtitle2' color='textSecondary'>
                    {value.friendlyName}
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    {value.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Grid>
      <Grid item>
        <Typography variant='h4'>Issued Certificates</Typography>
        {/* --- CertificateAccessList Placeholder --- */}
        <Box sx={{ mt: 1, p: 2, border: '1px dashed grey', borderRadius: 1, textAlign: 'center' }}>
          <Typography color="textSecondary">CertificateAccessList component needs to be created/refactored.</Typography>
          {/* <CertificateAccessList
            itemsDisplayed='apps' // Or 'counterparties'?
            canRevoke
            clickable={false}
            type={certType}
          /> */}
        </Box>
        {/* --- End Placeholder --- */}
      </Grid>
      {/* Removed ProtocolPermissionList as it seemed out of place here */}
    </Grid>
  );
};

export default CertificateAccess;

