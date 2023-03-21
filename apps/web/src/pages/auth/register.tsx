import AuthLayout from "@/components/Layout/AuthLayout";
import OnlyGuest from "@/middlewares/OnlyGuest";
import { useAuthRegisterMutation } from "@/services/auth";
import { RegisterFormData } from "@/types";
import getErrorTranslation from "@/utils/errors";
import { getErrorFromPayload } from "@/utils/hooks";
import { RegisterSchema } from "@/utils/schemas";
import { Button, Input } from "@devsozluk/ui";
import { Form, Formik } from "formik";
import { useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";
import { RiLockPasswordLine, RiMailLine, RiUser3Line } from "react-icons/ri";

const Register = () => {
  const initialValues: RegisterFormData = {
    name: "",
    username: "",
    email: "",
    password: "",
  };

  const [handleAuthRegister, { isLoading, status, data, error, isError }] =
    useAuthRegisterMutation({});

  useEffect(() => {
    if (status === "fulfilled") {
      toast.success("Kayıt başarılı, yönlendiriliyorsunuz.");
    } else if (status === "rejected") {
      const errorMessage = getErrorFromPayload(error);
      toast.error(getErrorTranslation(errorMessage));
    }
  }, [status]);

  const handleSubmit = useCallback(async (values: RegisterFormData) => {
    handleAuthRegister(values);
  }, []);

  const checkUsername = (username: string) =>
    username
      .replace(/[^a-zA-Z0-9]/g, "")
      .replace(/([A-Z])/g, (match) => match.toLowerCase());

  return (
    <Formik
      validationSchema={RegisterSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {({ errors, values, setFieldValue }) => (
        <Form className="space-y-6">
          <div className="space-y-6">
            <div className="flex space-x-6">
              <Input
                name="name"
                errorMessage={errors.name}
                value={values.name}
                renderLeftIcon={<RiUser3Line size={24} />}
                onChange={(event) => setFieldValue("name", event.target.value)}
                placeholder="İsim"
              />
              <Input
                name="username"
                errorMessage={errors.username}
                value={values.username}
                renderLeftIcon={<RiUser3Line size={24} />}
                onChange={(event) =>
                  setFieldValue("username", checkUsername(event.target.value))
                }
                placeholder="Kullanıcı Adı"
              />
            </div>
            <Input
              name="email"
              autoComplete="on"
              errorMessage={errors.email}
              value={values.email}
              renderLeftIcon={<RiMailLine size={24} />}
              onChange={(event) => setFieldValue("email", event.target.value)}
              placeholder="Email"
            />
            <Input
              name="password"
              type="password"
              value={values.password}
              onChange={(event) =>
                setFieldValue("password", event.target.value)
              }
              renderLeftIcon={<RiLockPasswordLine size={24} />}
              errorMessage={errors.password}
              placeholder="Şifre"
              autoComplete="new-password"
            />
          </div>
          <Button className="w-full" loading={isLoading} type="submit">
            Kaydol
          </Button>
        </Form>
      )}
    </Formik>
  );
};

Register.getLayout = (page: React.ReactElement) => {
  return (
    <OnlyGuest>
      <AuthLayout>
        <AuthLayout.Title>Yeni hesap oluştur</AuthLayout.Title>
        <AuthLayout.Description link="/auth/login" linkText="Giriş Yap">
          Zaten hesabınız var mı?
        </AuthLayout.Description>
        {page}
      </AuthLayout>
    </OnlyGuest>
  );
};

export default Register;
