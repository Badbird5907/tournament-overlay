import {Card, CardBody} from "@nextui-org/card";

const Index = () => {
  return (
    <div>
      <h1>test</h1>
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <h1 className="text-4xl font-bold text-center">test123</h1>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
