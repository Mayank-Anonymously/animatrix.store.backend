import { capitalCase } from "change-case";
import { Link as RouterLink } from "react-router-dom";
// material
import { styled } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Stack,
  Link,
  Alert,
  Tooltip,
  Container,
  Typography,
  Button,
} from "@material-ui/core";
// routes
import { PATH_AUTH } from "../../routes/paths";
// hooks
import useAuth from "../../hooks/useAuth";
// layouts
import AuthLayout from "../../layouts/AuthLayout";
// components
import Page from "../../components/Page";
import { MHidden } from "../../components/@material-extend";
import { LoginForm } from "../../components/authentication/login";
import AuthFirebaseSocials from "../../components/authentication/AuthFirebaseSocial";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method, login } = useAuth();

  const handleLoginAuth0 = async () => {
    try {
      await login();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyle title="Login | Animatrix Store ">
      <AuthLayout>
        New User Sign Up ? &nbsp;
        <Link
          underline="none"
          variant="subtitle2"
          component={RouterLink}
          to={PATH_AUTH.register}
        >
          Register
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h4" sx={{ px: 5, mt: 0, mb: 0 }}>
            Animatrix Store
          </Typography>

          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="subtitle2"
                style={{ fontSize: 16 }}
                gutterBottom
              >
                Sign in to your Animatrix Store account
              </Typography>
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                Enter your account details below.
              </Typography>
            </Box>

            <Tooltip title={capitalCase(method)}>
              <Box
                component="img"
                src={`/static/auth/ic_${method}.png`}
                sx={{ width: 32, height: 32 }}
              />
            </Tooltip>
          </Stack>

          {method === "firebase" && <AuthFirebaseSocials />}

          <Alert severity="info" sx={{ mb: 3 }}>
            Use email : <strong>client@gmail.com</strong> / password :
            <strong>&nbsp;123456</strong>
          </Alert>

          {method !== "auth0" ? (
            <LoginForm />
          ) : (
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={handleLoginAuth0}
            >
              Login
            </Button>
          )}

          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?&nbsp;
              <Link
                variant="subtitle2"
                component={RouterLink}
                to={PATH_AUTH.register}
              >
                Get started
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
